import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'


export const HomePage = () => {

    const history = useHistory()

    useEffect(() => {
        axios.get('http://localhost:8080/login', {
            headers: { 'token': localStorage.getItem('token') }
        }).then(res => {
            if (res.status === 200) {
                const { token, isAdmin } = res.data
                localStorage.setItem('token', token)
                localStorage.setItem('isAdmin', isAdmin)
                isAdmin ? history.push('/users') : history.push('/tasks')
            }
        }).catch(err => {
            if (err.status === 401) {
                history.push('/login')
            }
        })
    })

    return <></>
}

