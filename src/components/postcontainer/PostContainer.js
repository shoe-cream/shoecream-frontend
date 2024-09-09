const PostContainer = ({ leftContent, rightContent, leftSearch, rightSearch }) => {
    return (
        <div className='manufacturer-content-container'>
        <div className='manufacturer-content'>
            <div className='manufacturer-content-name'>{leftContent}</div>
            <input className='manufacturer-content-input'></input>
            {leftSearch === undefined ? <div></div> : <img className = 'item-search-button' src='icons/zoom.png'></img>}
        </div>
        <div className='manufacturer-content'>
            <div className='manufacturer-content-name'>{rightContent}</div>
            <input className='manufacturer-content-input'></input>
            {rightSearch === undefined ? <div></div> : <img className = 'item-search-button' src='icons/zoom.png'></img>}
        </div>
    </div>
    );
}
export default PostContainer;