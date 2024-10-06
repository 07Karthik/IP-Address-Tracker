import "./Error.css";

const Error = (err) => {
  return (
    <>
      <div className="overlay">
        <div className="error">
          <h2>Error While Fetching...</h2>
          <p>
            Something went wrong while trying to get the data. Please try again
            later.
          </p>
        </div>
      </div>
    </>
  );
};

export default Error;
