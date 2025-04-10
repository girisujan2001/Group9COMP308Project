import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { GET_HELP_REQUESTS } from '../graphql/queries';
import { 
  CREATE_HELP_REQUEST, 
  DELETE_HELP_REQUEST, 
  RESOLVE_HELP_REQUEST,
  VOLUNTEER_FOR_HELP,
  WITHDRAW_FROM_HELP
} from '../graphql/mutations';

// Validation schema for creating a help request
const helpRequestSchema = Yup.object().shape({
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  location: Yup.string()
    .required('Location is required')
});

const HelpRequests = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(undefined); // undefined = all, true = resolved, false = unresolved
  
  // Query to get help requests
  const { loading, error: queryError, data, refetch } = useQuery(GET_HELP_REQUESTS, {
    variables: filter !== undefined ? { isResolved: filter }
 : {}
  });
  
  // Mutation to create a help request
  const [createHelpRequest, { loading: createLoading }] = useMutation(CREATE_HELP_REQUEST, {
    onCompleted: (data) => {
      setShowCreateModal(false);
      
      // Refetch with the current filter to ensure the view updates correctly
      refetch({ 
        variables: filter !== undefined ? { isResolved: filter } : {} 
      });
    },
    update(cache, { data }) {
      try {
        if (!data || !data.createHelpRequest) {
          console.error('No data returned from createHelpRequest mutation');
          return;
        }

        const newHelpRequest = data.createHelpRequest;
        cache.modify({
          fields: {
            getHelpRequests(existingRefs = [], { readField }) {
              const newHelpRequestRef = cache.writeFragment({
                data: newHelpRequest,
                fragment: gql`
                  fragment NewHelpRequest on HelpRequest {
                    id
                    description
                    location
                    isResolved
                    createdAt
                    updatedAt
                    author {
                      id
                      username
                      role
                    }
                    volunteers {
                      id
                      username
                      role
                    }
                  }
                `
              });

              // Only add the new help request if it matches the current filter
              if (filter === undefined || filter === newHelpRequest.isResolved) {
                return [...existingRefs, newHelpRequestRef];
              }

              return existingRefs;
            }
          }
        });
      } catch (error) {
        console.error('Error updating cache:', error);
      }
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Mutation to delete a help request
  const [deleteHelpRequest] = useMutation(DELETE_HELP_REQUEST, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Mutation to resolve/unresolve a help request
  const [resolveHelpRequest] = useMutation(RESOLVE_HELP_REQUEST, {
    onCompleted: () => {
      refetch();
    },
    update(cache, { data }) {
      try {
        if (!data || !data.resolveHelpRequest) {
          console.error('No data returned from resolveHelpRequest mutation');
          return;
        }

        const updatedHelpRequest = data.resolveHelpRequest;
        const cacheId = cache.identify(updatedHelpRequest);
         
       if (cacheId) {
          cache.modify({
            id: cacheId,
          });
        }
      } catch (error) {
        console.error('Error updating cache:', error);
      }
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Mutation to volunteer for a help request
  const [volunteerForHelp] = useMutation(VOLUNTEER_FOR_HELP, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Mutation to withdraw from a help request
  const [withdrawFromHelp] = useMutation(WITHDRAW_FROM_HELP, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Handle creating a new help request
  const handleCreateHelpRequest = async (values) => {
    setError('');
    try {
      await createHelpRequest({
        variables: {
          input: {
            description: values.description,
            location: values.location
          }
        }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };
  
  // Handle deleting a help request
  const handleDeleteHelpRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this help request?')) {
      try {
        await deleteHelpRequest({
          variables: { id }
        });
      } catch (error) {
        // Error is handled in onError callback
      }
    }
  };
  
  // Handle resolving/unresolving a help request
  const handleToggleResolve = async (id, currentStatus) => {
    try {
      await resolveHelpRequest({
        variables: { 
          id,
          isResolved: !currentStatus
        }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };
  
  // Handle volunteering for a help request
  const handleVolunteer = async (id) => {
    try {
      await volunteerForHelp({
        variables: { helpRequestId: id }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };
  
  // Handle withdrawing from a help request
  const handleWithdraw = async (id) => {
    try {
      await withdrawFromHelp({
        variables: { helpRequestId: id }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };
  
  // Check if current user is a volunteer for a help request
  const isVolunteer = (helpRequest) => {
    // In a real app, we would check if the current user's ID is in the volunteers array
    // For now, we'll just return false
    return false;
  };
  
  if (loading) return <div className="text-center mt-5">Loading help requests...</div>;
  if (queryError) return <Alert variant="danger">Error loading help requests: {queryError.message}</Alert>;
  
  const helpRequests = data?.getHelpRequests || [];
  
  return (
    <Container className="community-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Help Requests</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Request Help
        </Button>
      </div>
      
      <div className="mb-4">
        <Button 
          variant={filter === undefined ? "primary" : "outline-primary"} 
          className="me-2"
          onClick={() => setFilter(undefined)}
        >
          All
        </Button>
        <Button 
          variant={filter === false ? "primary" : "outline-primary"} 
          className="me-2"
          onClick={() => setFilter(false)}
        >
          Active
        </Button>
        <Button 
          variant={filter === true ? "primary" : "outline-primary"}
          onClick={() => setFilter(true)}
        >
          Resolved
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {helpRequests.length === 0 ? (
        <Alert variant="info">No help requests found. Create one to get help from your community!</Alert>
      ) : (
        helpRequests.map(helpRequest => (
          <Card 
            key={helpRequest.id} 
            className={`help-request-card ${helpRequest.isResolved ? 'resolved' : ''}`}
          >
            <Card.Body>
              <div className="d-flex justify-content-between">
                <Card.Title>{helpRequest.description}</Card.Title>
                <Badge bg={helpRequest.isResolved ? "success" : "warning"}>
                  {helpRequest.isResolved ? "Resolved" : "Active"}
                </Badge>
              </div>
              <Card.Subtitle className="mb-2 text-muted">
                Posted by {helpRequest.author.username} on {moment(helpRequest.createdAt).format('MMMM D, YYYY')}
              </Card.Subtitle>
              <Card.Text>
                <strong>Location:</strong> {helpRequest.location}
              </Card.Text>
              
              {helpRequest.volunteers && helpRequest.volunteers.length > 0 && (
                <div className="mb-3">
                  <strong>Volunteers:</strong> {helpRequest.volunteers.map(v => v.username).join(', ')}
                </div>
              )}
              
              <div className="d-flex justify-content-end mt-3">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleToggleResolve(helpRequest.id, helpRequest.isResolved)}
                >
                  {helpRequest.isResolved ? "Mark as Active" : "Mark as Resolved"}
                </Button>
                
                {!helpRequest.isResolved && !isVolunteer(helpRequest) && (
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleVolunteer(helpRequest.id)}
                  >
                    Volunteer to Help
                  </Button>
                )}
                
                {!helpRequest.isResolved && isVolunteer(helpRequest) && (
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleWithdraw(helpRequest.id)}
                  >
                    Withdraw
                  </Button>
                )}
                
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDeleteHelpRequest(helpRequest.id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
      
      {/* Create Help Request Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ description: '', location: '' }}
            validationSchema={helpRequestSchema}
            onSubmit={handleCreateHelpRequest}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                    placeholder="Describe what you need help with"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.location && errors.location}
                    placeholder="Where do you need help?"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.location}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="me-2"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting || createLoading}
                  >
                    {createLoading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HelpRequests;