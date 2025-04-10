import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { GET_POSTS } from '../graphql/queries';
import { CREATE_POST, DELETE_POST, GENERATE_AI_SUMMARY } from '../graphql/mutations';

// Validation schema for creating a news post
const newsSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters'),
  content: Yup.string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters')
});

const News = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  
  // Query to get news posts
  const { loading, error: queryError, data, refetch } = useQuery(GET_POSTS, {
    variables: { category: 'news' }
  });
  
  // Mutation to create a news post
  const [createPost, { loading: createLoading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setShowCreateModal(false);
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Mutation to delete a post
  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Mutation to generate AI summary
  const [generateAISummary] = useMutation(GENERATE_AI_SUMMARY, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Handle creating a new post
  const handleCreatePost = async (values) => {
    setError('');
    try {
      await createPost({
        variables: {
          input: {
            title: values.title,
            content: values.content,
            category: 'news'
          }
        }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };
  
  // Handle deleting a post
  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this news post?')) {
      try {
        await deletePost({
          variables: { id }
        });
      } catch (error) {
        // Error is handled in onError callback
      }
    }
  };
  
  // Handle generating AI summary
  const handleGenerateAISummary = async (id) => {
    try {
      await generateAISummary({
        variables: { postId: id }
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };
  
  if (loading) return <div className="text-center mt-5">Loading news...</div>;
  if (queryError) return <Alert variant="danger">Error loading news: {queryError.message}</Alert>;
  
  const posts = data?.getPosts || [];
  
  return (
    <Container className="community-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Community News</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Post News
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {posts.length === 0 ? (
        <Alert variant="info">No news posts yet. Be the first to share news with the community!</Alert>
      ) : (
        posts.map(post => (
          <Card key={post.id} className="post-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <Card.Title>{post.title}</Card.Title>
                <Badge bg="primary">{post.category}</Badge>
              </div>
              <Card.Subtitle className="mb-2 text-muted">
                Posted by {post.author.username} on {moment(post.createdAt).format('MMMM D, YYYY')}
              </Card.Subtitle>
              <Card.Text>{post.content}</Card.Text>
              
              {post.aiSummary && (
                <Alert variant="info">
                  <strong>AI Summary:</strong> {post.aiSummary}
                </Alert>
              )}
              
              <div className="d-flex justify-content-end mt-3">
                {!post.aiSummary && (
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleGenerateAISummary(post.id)}
                  >
                    Generate AI Summary
                  </Button>
                )}
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
      
      {/* Create News Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Post News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ title: '', content: '' }}
            validationSchema={newsSchema}
            onSubmit={handleCreatePost}
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
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.content && errors.content}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.content}
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
                    {createLoading ? 'Posting...' : 'Post News'}
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

export default News;