import './CheckButton.css';

const CheckButton = ({ content, buttonChecked, setButtonChecked, input, isErrorShown }) => {
    return (
        <div>
            <button 
                className="check-button" 
                onClick={() => {
                if(buttonChecked){
                    return;
                }
                if(input === '' || isErrorShown){
                    alert('올바른 형식으로 입력해주세요');
                    return;
                }
                setButtonChecked(true);
                alert(content + ' 완료');
                }}
                style={{'--check-button-color': `${buttonChecked ? '#769ADC' : '#d1d1d1'}` }}
                >{content + (buttonChecked ? ' ✔' : '')}</button>
        </div>
    );
}
export default CheckButton;