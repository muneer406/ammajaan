import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UI error boundary:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="page">
          <div className="neo-panel error-boundary">
            <h2>Something went wrong</h2>
            <p>
              This part of the page crashed. You can go home or reload and try
              again.
            </p>
            <div className="error-boundary__actions">
              <button
                type="button"
                className="nav-link"
                onClick={this.handleReset}
              >
                Try again
              </button>
              <Link to="/" className="nav-link">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
