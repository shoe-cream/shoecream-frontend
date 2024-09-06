import './Input.css';

const Input = ({ placeholder, errorMessage })=> {
    return (
        <div className="input-container">
            <input className="input-window" placeholder={placeholder}></input>
            <div className="input-error-message">{errorMessage}</div>
        </div>
    );
}
export default Input;