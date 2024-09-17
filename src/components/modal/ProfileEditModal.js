import sendPatchMyInfoRequest from "../../requests/PatchMyInfoRequest";

const ProfileEditModal = ({ setOpened, inputs, onModify }) => {

    return (
        <div className="modal-background">
            <div className='modal-container-narrow'>
                <h2 className="modal-label">프로필 수정</h2>
                <div className="profile-modify-input-container">
                    {inputs.map((input) => (
                        <input
                            className={input.input === '' ? 'profile-modify-input-empty' : 'profile-modify-input'}
                            placeholder={input.placeholder}
                            onBlur={(e) => input.setInput(e.target.value)}
                            type="search"
                        ></input>
                    ))}
                </div>
                <div className='post-modal-button-container'>
                    <button className="post-modal-button" onClick={() => {
                        const requestBody = inputs.reduce((acc, item) => {
                            if (item.input !== '') {
                                acc[item.accessor] = item.input;
                            }
                            return acc;
                        }, {});
                        console.log(requestBody);
                        onModify(requestBody);
                    }

                    }>확인</button>
                    <button className="post-modal-button" onClick={() => {
                        inputs.forEach(input => {
                            input.setInput('');
                        });
                        setOpened(false)
                    }}>취소</button>
                </div>
            </div>
        </div>
    );
}
export default ProfileEditModal;