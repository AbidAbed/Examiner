import { FallingLines } from 'react-loader-spinner'
import "./Loading.css"
function Loading() {
    return <div className='loading-container-parent'>
        <div className='loading-container'>
            <FallingLines
                color="#133554"
                width="100"
                visible={true}
                ariaLabel="falling-circles-loading"
            />
        </div>
    </div>
}
export default Loading