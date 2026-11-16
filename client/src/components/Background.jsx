import '../styles/background.css';

function Background() {
  return (
    <div className="bubble-background" aria-hidden="true">
      <div className="bubble bubble-blue bubble-one" />
      <div className="bubble bubble-yellow bubble-two" />
      <div className="bubble bubble-brown bubble-three" />
      <div className="bubble bubble-blue bubble-four" />
      <div className="bubble bubble-yellow bubble-five" />
    </div>
  );
}

export default Background;