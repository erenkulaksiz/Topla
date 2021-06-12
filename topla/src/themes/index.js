import dark from './dark'
import light from './light'

const Theme = (props) => {
    if (props == 'dark') {
        return dark
    } else {
        return light
    }
}

export default Theme;