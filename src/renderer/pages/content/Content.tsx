import { Link, useParams } from 'react-router-dom'


const Content = () => {

    const {id,type} = useParams();

  return (
    <div>
        <Link to={'/todo'}>
        <a  className='btn btn-primary'>New {type}</a>  
        </Link>
    </div>
  )
}

export default Content