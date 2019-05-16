import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'

import {
    getItems,
    addItem,
    updateItem
} from '../actions/toDoAction';

let markCompleteStyle = {
    textDecoration: "line-through"
}

class ToDo extends Component {
    state = { name: '' }

    componentDidMount() {
        this.props.dispatch(getItems());
    }
    handleChange(event) {
        this.setState({ name: event.target.value })
    }
    render() {
        const { dispatch, items, online } = this.props;

        const { name } = this.state;
        return (
            <Fragment>
                <h1>TO-DO List - {online ? '(online 😀)' : '(offline 😞)'}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: 10 }}>
                    <input type="text"
                        id="newItem"
                        value={name}
                        onChange={this.handleChange.bind(this)}
                    />
                    <input type="button"
                        value="+"
                        onClick={() => {
                            if (name !== '') {
                                dispatch(addItem({ name }));
                            }
                            else {
                                alert("Item cannot be blank!!")
                            }
                        }
                        } />
                </div>

                {
                    items && items.map(todo => (<p key={todo.id}
                        onClick={() => { dispatch(updateItem({ ...todo, completed: !todo.completed })) }}
                        style={todo.completed ? markCompleteStyle : {}}
                    >{todo.name}</p>))
                }
            </Fragment>
        );
    }
}

const mapStateToProps = ({ toDo }) => ({
    loading: toDo.loading,
    items: toDo.items,
    online: toDo.online
});

export default connect(mapStateToProps)(ToDo)