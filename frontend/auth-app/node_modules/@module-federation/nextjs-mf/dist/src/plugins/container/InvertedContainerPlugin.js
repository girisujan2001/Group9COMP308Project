"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvertedContainerRuntimeModule_1 = __importDefault(require("./InvertedContainerRuntimeModule"));
const enhanced_1 = require("@module-federation/enhanced");
class InvertedContainerPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('EmbeddedContainerPlugin', (compilation) => {
            const hooks = enhanced_1.FederationModulesPlugin.getCompilationHooks(compilation);
            const containers = new Set();
            hooks.addContainerEntryModule.tap('EmbeddedContainerPlugin', (dependency) => {
                if (dependency instanceof enhanced_1.dependencies.ContainerEntryDependency) {
                    containers.add(dependency);
                }
            });
            // Adding the runtime module
            compilation.hooks.additionalTreeRuntimeRequirements.tap('EmbeddedContainerPlugin', (chunk, set) => {
                compilation.addRuntimeModule(chunk, new InvertedContainerRuntimeModule_1.default({
                    containers,
                }));
            });
        });
    }
}
exports.default = InvertedContainerPlugin;
//# sourceMappingURL=InvertedContainerPlugin.js.map