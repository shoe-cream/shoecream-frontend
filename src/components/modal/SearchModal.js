const SearchModal = ({setOpenedModal}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-background">
                <h2 className="modal-title">찾기</h2>
                <button 
                className="modal-button"
                onClick={() => setOpenedModal(0)}
                >닫기</button>
            </div>
        </div>
    );
}
export default SearchModal;