import { useEffect, useState } from 'react';
import './PageContainer.css';

const getPageRange = (currentPage, pageInfo) => {

    /* console.log('currentPage: ', currentPage);
    console.log('pageInfo: ', pageInfo); */

    // currentPage를 중심으로 범위 2칸을 잡는다 가정
    let leftEnd = currentPage - 2;
    let rightEnd = currentPage + 2;
    // 배열의 왼쪽 끝이 1에서 몇 만큼 모자란지, ex: -1이면 2만큼 모자라고 오른쪽으로 2칸 밀어야함
    const leftOffset = 1 - leftEnd;

    if(leftOffset > 0){
        leftEnd += leftOffset;
        rightEnd += leftOffset;
        // 오른쪽 끝이 범위를 벗어나면 자르기
        rightEnd = Math.min(rightEnd, pageInfo.totalPage);
    }
    
    // 배열의 오른쪽 끝이 마지막 번호를 몇 만큼 벗어났는지, ex: 12/10이면 2만큼 왼쪽으로 당겨야함
    const rightOffset = rightEnd - pageInfo.totalPage;

    if(rightOffset > 0){
        leftEnd -= rightOffset;
        rightEnd -= rightOffset;
        // 왼쪽 끝이 범위를 벗어나면 자르기
        leftEnd = Math.max(leftEnd, 1);
    }

    /* console.log('leftEnd: ', leftEnd);
    console.log('rightEnd: ', rightEnd); */

    let array = [];

    for(let i = leftEnd; i<= rightEnd; i++){
        array.push(i);
    }
    // 최종 배열 생성
    /* console.log('array: ', array); */
    return array;
}

const PageContainer = ({ currentPage, setPage, pageInfo, getPage, setChecked, setPageOriginal, setIsLoading }) => {
    const [range, setRange] = useState(getPageRange(currentPage, pageInfo));

    useEffect(() => {
        if(pageInfo.totalPage > 0){
            setRange(getPageRange(currentPage, pageInfo));
        }
    }, [currentPage, pageInfo] );

    const changePage = (newPage) => {
        if(setIsLoading !== undefined){
            setIsLoading(true);
        }
        getPage(newPage);
        setPage(newPage);
        if(setChecked !== undefined){
            setChecked([]);
        }
        if(setPageOriginal !== undefined){
            setPageOriginal(newPage);
        }
    }

    return (
        <div className="page-container">
            <button className='page-button' onClick={() => {
                if(currentPage > 1){
                    changePage(1);
                }
            }}>{'<<'}</button>
            <button className='page-button' onClick={() => {
                if(currentPage > 1){
                    changePage(currentPage - 1);
                }
                }}>{'<'}</button>
            <div>
                {range.map((value)=> <button 
                className="page-button" 
                onClick={() => {
                    if(currentPage === value){
                        return;
                    }
                    /* console.log('value: ', value); */
                    changePage(value);
                }}
                style={{color: currentPage === value ? '#a883b5' : 'black', fontWeight: currentPage === value ? 'bold' : 100}}
                >{value}</button>)}
            </div>
            <button className='page-button' onClick={() => {
                if(currentPage < pageInfo.totalPage){
                    changePage(currentPage + 1);
                }
                }}>{'>'}</button>
            <button className='page-button' onClick={() => {
                if(currentPage < pageInfo.totalPage){
                    changePage(pageInfo.totalPage);
                }
            }}>{'>>'}</button>
        </div>
    );
}
export default PageContainer;