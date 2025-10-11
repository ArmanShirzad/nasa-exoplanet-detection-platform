# Contributing to NASA Exoplanet Detection Platform

Thank you for your interest in contributing to the NASA Exoplanet Detection Platform! This project was developed for NASA Space Apps Challenge 2025 and we welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/nasa-exoplanet-2025.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Follow the setup instructions in the main README.md

## 📋 How to Contribute

### 🐛 Bug Reports
- Use the GitHub issue tracker
- Include steps to reproduce the bug
- Provide system information (OS, Node.js version, Python version)
- Include error messages and screenshots if applicable

### ✨ Feature Requests
- Use the GitHub issue tracker with the "enhancement" label
- Describe the feature and its use case
- Consider the impact on existing functionality
- Check if the feature aligns with the project goals

### 🔧 Code Contributions
1. **Fork and Clone**: Fork the repository and clone your fork
2. **Create Branch**: Create a feature branch from `main`
3. **Make Changes**: Implement your changes following our coding standards
4. **Test**: Ensure all tests pass and add new tests if needed
5. **Commit**: Use clear, descriptive commit messages
6. **Push**: Push your changes to your fork
7. **Pull Request**: Create a pull request with a clear description

## 📝 Coding Standards

### Frontend (TypeScript/React)
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use meaningful component and variable names
- Add proper TypeScript types
- Use Tailwind CSS for styling
- Follow the existing component structure

### Backend (Python/FastAPI)
- Follow PEP 8 style guidelines
- Use type hints for all functions
- Add docstrings for public functions
- Use meaningful variable and function names
- Follow FastAPI best practices

### Machine Learning (Python)
- Add comprehensive docstrings
- Include data validation
- Follow scikit-learn conventions
- Add proper error handling
- Document model performance metrics

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
npm run build  # Ensure build succeeds
```

### Backend Testing
```bash
cd backend
python -m pytest  # If tests exist
python -m uvicorn src.app.main:app --reload  # Test server startup
```

### Manual Testing
- Test all API endpoints
- Verify UI components work correctly
- Test with different data inputs
- Ensure responsive design works

## 📚 Documentation

- Update README.md if you add new features
- Add JSDoc comments for complex functions
- Update API documentation if you modify endpoints
- Include examples in your code

## 🔍 Pull Request Process

1. **Description**: Provide a clear description of your changes
2. **Testing**: Explain how you tested your changes
3. **Breaking Changes**: Note any breaking changes
4. **Screenshots**: Include screenshots for UI changes
5. **Checklist**: Use the PR template checklist

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots here

## Additional Notes
Any additional information
```

## 🏗️ Project Structure

```
nasa-exoplanet-2025/
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
├── ML/               # Machine learning pipeline
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Add comprehensive test suite
- [ ] Improve error handling
- [ ] Add more data visualization features
- [ ] Enhance accessibility
- [ ] Add internationalization support

### Medium Priority
- [ ] Add more ML models
- [ ] Improve performance
- [ ] Add mobile app
- [ ] Add more data sources
- [ ] Enhance 3D visualization

### Low Priority
- [ ] Add themes
- [ ] Add more export formats
- [ ] Add user accounts
- [ ] Add collaboration features

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

### Communication
- Use GitHub issues for bug reports and feature requests
- Use GitHub discussions for general questions
- Be clear and concise in your communication
- Use proper English grammar and spelling

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/your-username/nasa-exoplanet-2025/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/nasa-exoplanet-2025/discussions)
- **Documentation**: Check the README.md and component-specific docs

## 🏆 Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the NASA Exoplanet Detection Platform! 🚀

*"The universe is not only stranger than we imagine, it is stranger than we can imagine."* - J.B.S. Haldane
