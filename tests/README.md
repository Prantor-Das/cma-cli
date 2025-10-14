# CMA CLI Test Suite

This directory contains comprehensive tests for the CMA CLI tool, covering various scenarios and edge cases.

## Test Files

### 1. `comprehensive.test.js`
The main test file that covers core functionality:
- **Project Name Validation**: Tests for valid/invalid project names, edge cases, and normalization
- **Constants Validation**: Verifies lock file mappings, GitHub URL patterns, and repository name patterns
- **Git Integration**: Tests GitHub username detection, repository validation, and URL construction
- **Questions Configuration**: Validates the CLI question structure and conditional logic
- **Project Detection**: Tests package manager detection from lock files and workspace configurations
- **Script Generation**: Tests script generation for different package managers (npm, yarn, pnpm, bun)
- **Git Handler**: Tests git operations, error handling, and repository initialization
- **Utility Functions**: Tests file operations, directory operations, and helper functions
- **Project Creation Edge Cases**: Tests various project creation scenarios
- **Error Handling and Recovery**: Tests graceful error handling
- **Package Manager Specific Tests**: Tests package manager-specific configurations
- **Template Processing**: Tests template file processing and customization

### 2. `package-manager.test.js`
Focused tests for package manager functionality:
- **Package Manager Detection**: Tests detection of npm, yarn, pnpm, and bun
- **Package Manager Installation**: Tests dependency installation with different managers
- **Package Manager Version Checks**: Tests version checking for all supported managers
- **Workspace Configuration**: Tests workspace setup for different package managers
- **Performance Tests**: Tests package manager operations performance
- **Concurrent Operations**: Tests handling multiple package manager operations

### 3. `template-processing.test.js`
Comprehensive tests for template file processing:
- **File Renaming**: Tests renaming of gitignore files and template test files
- **Content Replacement**: Tests project name replacement in various files (HTML, JSX, env files)
- **Client-Only Processing**: Tests removal of server-related content for client-only projects
- **Gitkeep File Cleanup**: Tests removal of .gitkeep files from templates
- **TypeScript vs JavaScript Processing**: Tests language-specific template processing
- **Error Handling**: Tests graceful handling of template processing errors
- **Performance Tests**: Tests template processing performance with large files

### 4. `error-scenarios.test.js`
Extensive error scenario and edge case testing:
- **Network and Connectivity Issues**: Tests handling of timeouts, DNS failures, connection errors
- **File System Errors**: Tests handling of permission denied, disk full, file not found errors
- **Memory and Resource Constraints**: Tests handling of memory limits and resource constraints
- **Invalid Input Handling**: Tests validation of various invalid inputs
- **Git Repository Edge Cases**: Tests malformed URLs, missing repositories, access issues
- **Package Manager Conflicts**: Tests handling of multiple lock files and corrupted files
- **Template Processing Errors**: Tests handling of corrupted templates and binary files
- **Concurrent Operation Issues**: Tests race conditions and concurrent access
- **Platform-Specific Issues**: Tests Windows/Unix path handling and reserved names
- **Recovery and Cleanup**: Tests cleanup after partial failures
- **Timeout and Cancellation**: Tests operation timeouts and user cancellation
- **Validation Edge Cases**: Tests extreme validation scenarios

### 5. `integration.test.js`
Full integration tests that test complete workflows:
- **Full Project Creation Workflows**: Tests complete project creation for different configurations
- **Package Manager Integration**: Tests integration with different package managers
- **Template Processing Integration**: Tests end-to-end template processing
- **Git Integration Workflows**: Tests git repository initialization and URL construction
- **Error Recovery Integration**: Tests recovery from various failure scenarios
- **Performance Integration**: Tests overall performance of project creation
- **Cross-Platform Integration**: Tests platform-specific behavior
- **Workspace Configuration Integration**: Tests workspace setup for monorepos

## Test Coverage

The test suite covers:
- ✅ **162 test cases** across 5 test files
- ✅ **Project validation** and name normalization
- ✅ **Package manager detection** and installation
- ✅ **Git integration** and repository handling
- ✅ **Template processing** and customization
- ✅ **Error handling** and recovery scenarios
- ✅ **Performance** and concurrent operations
- ✅ **Cross-platform** compatibility
- ✅ **Edge cases** and boundary conditions

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Structure

All tests use:
- **Vitest** as the test runner
- **Mocked dependencies** for isolated testing
- **Comprehensive assertions** for thorough validation
- **Error scenario testing** for robustness
- **Performance benchmarks** for optimization

## Key Testing Principles

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: External dependencies are mocked for predictable behavior
3. **Coverage**: Tests cover both happy paths and error scenarios
4. **Performance**: Tests include performance benchmarks and timeout handling
5. **Cross-platform**: Tests account for different operating systems
6. **Real-world scenarios**: Tests simulate actual usage patterns and edge cases

## Adding New Tests

When adding new functionality:
1. Add unit tests to the appropriate test file
2. Add integration tests for end-to-end workflows
3. Add error scenario tests for failure cases
4. Update this README with new test descriptions
5. Ensure all tests pass before committing

## Test Maintenance

- Tests are automatically run on CI/CD
- Mock implementations should match real behavior
- Performance tests should be updated when optimizations are made
- Error scenarios should be expanded as new edge cases are discovered