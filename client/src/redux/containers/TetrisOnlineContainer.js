import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import queryString from 'query-string'
import TetrisContainer from './TetrisContainer'
import TetrisEnemyContainer from './TetrisEnemyContainer'
import Error from '../components/ErrorComponent'
import Navbar from './Navbar'
import Loader from '../components/Loading'
import { joinActionCreator, joinFailure, roomEventListeners, leaveRoom } from '../actions/actions'

function TetrisOnlineContainer({location}) {
    const dispatch = useDispatch()
    const {room, error, light, loading} = useSelector(state => state)
    const clients = [...room.clients.values()]
    
    useEffect(() => {
        let {name, room} = queryString.parse(location.search)

        if (!name || !room)
            dispatch(joinFailure("Name or Room not specified"))
        else {
            if (Array.isArray(name))
                name = name[0]
            if (Array.isArray(room))
                room = room[0]
            dispatch(joinActionCreator({name, room}))
            dispatch(roomEventListeners())
        }
        return () => {
            dispatch(leaveRoom())
        }
    }, [dispatch, location.search])

    return (
        <div>
            {
            loading ? <Loader /> :
            error ? <Error error={error}/> :
            <div>
                <Navbar />
                <div className="gameContainer">
                    <TetrisContainer mode={'online'}/>
                    {clients.map((el, index) => (<TetrisEnemyContainer key={index} className="EnemyContainer" board={el.board} info={el.peer} light={light}/>))}
                </div>
            </div>
            }
        </div>
    )
}

export default TetrisOnlineContainer
