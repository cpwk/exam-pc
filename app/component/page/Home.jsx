import React from 'react'
import U from "../../common/U";
import {App, CTYPE} from "../../common/index";
import {Banners} from "../Comps";
import '../../assets/css/page/home.scss'


const bannerType = CTYPE.bannerTypes.HOME;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: [],
        }
    }

    componentDidMount() {
        U.setWXTitle('首页');
        this.loadData();
    }

    loadData = () => {
        App.api('/pc/home/banners', {bannerQo: JSON.stringify({type: bannerType})}).then((banners) => {
            this.setState({banners})
        });
    };

    render() {

        let {banners = []} = this.state;


        return <div className='home-page'>

            {banners.length > 0 && <Banners banners={banners} bannerType={bannerType}/>}

        </div>

    }
}

