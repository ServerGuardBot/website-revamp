import React, { Component } from 'react';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.user
        }
    }

    render() {
        return (
            <div className="home">
                
            </div>
        )
    }
}