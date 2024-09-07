import { useEffect, useState } from 'react';
import CheckButton from './CheckButton';
import './Input.css';

const Input = ({ placeholder, errorMessage, regex, buttonContent, buttonChecked, setButtonChecked,
     opponentInput, setIsOpponentErrorShown, setInput, isErrorShown, setIsErrorShown
 })=> {
    const type = placeholder.includes('비밀번호') ? 'password' : undefined;
    const [inputValue, setInputValue] = useState('');
    const [errorState, setErrorState] = useState(false);

    const handleInputChange = (e) => {
        if(setButtonChecked !== undefined){
            setButtonChecked(false);
        }

        const value = e.target.value;
        setInputValue(value);
        
        if(setInput !== undefined){
            setInput(value);
        }
        if(placeholder === '비밀번호'){
            if(opponentInput !== ''){
                setIsOpponentErrorShown(value !== opponentInput);
            }
        }
        if(placeholder === '비밀번호 확인'){
            /* console.log('opponentInput: ', opponentInput, 'this: ', value); */
            setIsErrorShown(value !== opponentInput);
            return;
        }

        const regexObj = new RegExp(regex);
        const passed = !regexObj.test(value);
        setIsErrorShown(passed);
        setErrorState(passed);
    }

    return (
        <div className="input-container">
            <input className="input-window" type={type} placeholder={placeholder} onChange={handleInputChange}></input>
            <div className='input-lower-container'>
                {isErrorShown ? <div className="input-error-message">{errorMessage}</div> : <div/>}
                {buttonContent === undefined ? <div></div> : 
                <CheckButton content={buttonContent} buttonChecked={buttonChecked} setButtonChecked={setButtonChecked}
                    input={inputValue} isErrorShown={errorState}
                ></CheckButton>}
            </div>
        </div>
    );
}
export default Input;