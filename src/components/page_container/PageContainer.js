import { useEffect, useState } from 'react';
import './PageContainer.css';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

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
    }, [currentPage, pageInfo]);

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
    };

    return (
        <nav className="pagination-container">
            <ul className="pagination">
                <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="pagination-link" onClick={() => changePage(1)} disabled={currentPage === 1}>
                        <ChevronsLeft size={18} />
                    </button>
                </li>
                <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="pagination-link" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft size={18} />
                    </button>
                </li>
                {range.map((value) => (
                    <li key={value} className={`pagination-item ${currentPage === value ? 'active' : ''}`}>
                        <button
                            className="pagination-link"
                            onClick={() => changePage(value)}
                            disabled={currentPage === value}
                        >
                            {value}
                        </button>
                    </li>
                ))}
                <li className={`pagination-item ${currentPage === pageInfo.totalPage ? 'disabled' : ''}`}>
                    <button className="pagination-link" onClick={() => changePage(currentPage + 1)} disabled={currentPage === pageInfo.totalPage}>
                        <ChevronRight size={18} />
                    </button>
                </li>
                <li className={`pagination-item ${currentPage === pageInfo.totalPage ? 'disabled' : ''}`}>
                    <button className="pagination-link" onClick={() => changePage(pageInfo.totalPage)} disabled={currentPage === pageInfo.totalPage}>
                        <ChevronsRight size={18} />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PageContainer;