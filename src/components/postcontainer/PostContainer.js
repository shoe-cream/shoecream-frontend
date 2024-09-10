const PostContainer = ({ leftContent, rightContent, leftSearch, rightSearch, leftInput, rightInput, setLeftInput, setRightInput }) => {
    return (
        <div className='manufacturer-content-container'>
        <div className='manufacturer-content'>
            <div className='manufacturer-content-name'>{leftContent}</div>
            <input className='manufacturer-content-input'
                value={leftInput}
                onChange={(e) => setLeftInput(e.target.value)}></input>
            {leftSearch === undefined ? <div></div> : <img className = 'item-search-button' src='icons/zoom.png'></img>}
        </div>
        <div className='manufacturer-content'>
            <div className='manufacturer-content-name'>{rightContent}</div>
            {rightContent === undefined ? <div></div> : 
            <input className='manufacturer-content-input'
                value={rightInput}
                onChange={(e) => setRightInput(e.target.value)}
            ></input>}
            {rightSearch === undefined ? <div></div> : <img className = 'item-search-button' src='icons/zoom.png'></img>}
        </div>
    </div>
    );
}
export default PostContainer;