import { translate, waitForLoad } from "../translator.jsx";
import React, { Component } from 'react';
import { Link } from "react-router-dom";

var NavBtnText = document.createElement('button')
NavBtnText.classList.add('nav-button')

const NavBtnLineHeight = .7

export class NavChoice {
    disabled = false;
    icon = "home";
    link = undefined

    constructor(icon, disabled, link) {
        this.icon = icon || "home";
        this.disabled = disabled == true;
        this.link = link || undefined;
    }
}

class NavCategory extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);

        this.state ={
            collapsed: props.collapsed == true
        };
    }

    onClick() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        let choices = this.props.choices;
        return (
            <div className="nav-category-container">
                <button className="nav-category"
                    onClick={this.onClick}
                >
                    {this.props.name}
                    <span class="material-symbols-outlined icon">{(this.state.collapsed) ? "expand_more" : "expand_less"}</span>
                </button>
                <div style={{
                    height: `${(NavBtnLineHeight*(choices.length + 1))}rem`,
                    '--height': `${(NavBtnLineHeight*(choices.length + 1))}rem`
                }} className={`nav-category-choices${(this.state.collapsed) ? " collapsed" : ""}`}>
                    {
                        choices
                    }
                </div>
            </div>
        )
    }
}

class NavButton extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        if (this.props.parent.state.selected !== this.props.name) {
            if (this.props.parent?.itemSelected !== undefined && this.props.parent?.itemSelected !== null) {
                this.props.parent.itemSelected(this.props.name);
            }
            this.props.parent.setState({
                selected: this.props.name
            });
        }
    }

    render() {
        if (this.props?.link !== undefined && this.props?.link !== null && this.props.disabled !== true) {
            return (
                <Link to={this.props.link}>
                    <button className={`nav-button${(this.props.selected == true) ? " selected" : ""}`} onClick={this.onClick} disabled={this.props.disabled}>
                        <span class="material-symbols-outlined icon">{this.props.icon}</span>
                        {this.props.name}
                    </button>
                </Link>
            )
        } else {
            return (
                <button className={`nav-button${(this.props.selected == true) ? " selected" : ""}`} onClick={this.onClick} disabled={this.props.disabled}>
                    <span class="material-symbols-outlined icon">{this.props.icon}</span>
                    {this.props.name}
                </button>
            )
        }
    }
}

function getFirstNavItem(list) {
    for (const [name, element] of Object.entries(list)) {
        if (element instanceof NavChoice) {
            return name;
        }
        else if (element.constructor == Object) {
            let first = getFirstNavItem(element);
            if (first !== null && first !== undefined) {
                return first;
            }
        }
        else {
            console.error(`Expected an array or NavChoice, got '${typeof element}' instead`);
        }
    }
}

function renderItem(name, item, selected, parent) {
    if (item instanceof NavChoice) {
        return <NavButton parent={parent} name={name} link={item.link} disabled={item.disabled} icon={item.icon} selected={(selected == name)} />
    }
    else if (item.constructor == Object) {
        let items = {};
        let itemList = [];
        for (const [name, element] of Object.entries(item)) {
            let newItem = renderItem(name, element, selected, parent);
            items[name] = newItem;
            itemList.push(newItem)
        }
        return <NavCategory name={name} choices={itemList} />
    }
    else {
        console.error(`Expected an array or NavChoice, got '${typeof element}' instead`);
    }
}

class ServerNavIcon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.href !== undefined) {
            return (
                <a href={this.props.href} disabled={this.props.disabled} className="link-wrap">
                    <img src={this.props.img} alt={this.props.alt} disabled={this.props.disabled} className={`dash-server-icon${(this.props.selected == true) ? " selected" : ""}`} />
                </a>
            )
        } else {
            return (
                <Link to={this.props.link} disabled={this.props.disabled} className="link-wrap">
                    <img src={this.props.img} alt={this.props.alt} disabled={this.props.disabled} className={`dash-server-icon${(this.props.selected == true) ? " selected" : ""}`} />
                </Link>
            )
        }
    }
}

export class ServerNavigation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var user = this.props.user;
        var server = this.props.server;

        return (
            <div className="dash-servers">
                <ServerNavIcon link="/" img="/images/logo.svg" alt="Home Button" />
                {user.guilds.map((guild, index) => (guild.active == false) ? null : <ServerNavIcon link={`/servers/${guild.id}`} selected={guild.id == server.id} alt={guild.name} disabled={guild.active == false} img={(guild.avatar != null) ? guild.avatar : "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_1.png"} />)}
            </div>
        )
    }
}

export class Navigation extends Component {
    constructor(props) {
        super(props);

        let first = getFirstNavItem(props.choices);
        if ((first == undefined || first == null) && props.default == undefined) {
            console.error('Could find no default choice');
        }

        this.itemSelected = props.itemSelected;

        this.state = {
            selected: (props.default !== undefined) ? props.default : first
        };
    }

    render() {
        let listItems = [];

        for (const [name, element] of Object.entries(this.props.choices)) {
            listItems.push(renderItem(name, element, this.state.selected, this));
        }
        return (
            <div className="dash-nav">
                <div
                    className="dash-banner"
                    style={
                        {
                            '--image': `url(${(this.props.server?.banner !== undefined && this.props.server?.banner !== null) ? this.props.server?.banner : ""})`
                        }
                    }
                >
                    <h1>{this.props.server.name}</h1>
                    <div className="dash-banner-image">
                        <div className="inner" />
                    </div>
                </div>
                <nav>
                    {listItems}
                </nav>
            </div>
        )
    }
}