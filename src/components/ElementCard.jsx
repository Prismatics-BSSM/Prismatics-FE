import './ElementCard.css';

export default function ElementCard({ element, selected, onClick }) {
  if (!element) return null;

  return (
    <div
      className={`ElementCard ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="ElementCardName">
        <p>{element.symbol}</p>
      </div>
    </div>
  );
}
