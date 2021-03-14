import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from '../libs/debounce';
import './style.scoped.styl';

class AutoComplete extends Component {
  constructor() {
    super();

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onItemMouseDown = this.onItemMouseDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.debouncedSearch = debounce(this.search.bind(this), 300);

    this.input = React.createRef();
    this.list = React.createRef();

    this.state = {
      list: [],
      focused: false,
      query: '',
      selectedItem: null,
      focusedIndex: null,
      state: 'idle', // idle/typing/searching/found/notFound/selected
    };
  }

  onQueryChange({ target: { value } }) {
    this.setState({
      selectedItem: null,
      query: value,
      focusedIndex: null,
      state: value ? 'typing' : 'idle',
    });
    this.debouncedSearch(value);
  }

  onItemMouseDown() {
    // Items list is visible when input is in focus.
    // Items list is out of input range so when users clicks on
    // the item there is a problem: input blur fires before
    // item click event so setItem is never called.
    // That's why we need manually to set focus before blur fires.
    setTimeout(() => this.input.current.focus());
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  onKeyDown(e) {
    const mapping = {
      40: 'down',
      38: 'up',
      13: 'enter',
    };
    const key = mapping[e.which];
    const { focusedIndex, list } = this.state;

    if (!key || !list.length) return;

    e.preventDefault();

    if (key === 'enter') {
      if (focusedIndex !== null) {
        this.setItem(list[focusedIndex]);
      }
      return;
    }

    if (focusedIndex !== null) {
      const maxIndex = list.length - 1;
      const currentIndex = focusedIndex;
      let newIndex = currentIndex + (key === 'down' ? 1 : -1);
      if (newIndex < 0) newIndex = 0;
      if (newIndex > maxIndex) newIndex = maxIndex;
      this.setState({ focusedIndex: newIndex }, () => this.scrollToFocusedItem());
      return;
    }

    this.setState({ focusedIndex: 0 }, () => this.scrollToFocusedItem());
  }

  setItem(item) {
    // We need to blur input after item selected because
    // it is in focus still: See "onItemMouseDown" method comment.
    setTimeout(() => this.input.current.blur());

    const { onChange } = this.props;

    this.setState({
      selectedItem: item,
      query: '',
      list: [],
      focusedIndex: null,
      state: 'selected',
    });

    onChange(item);
  }

  search(value) {
    if (!value) {
      this.setState({ list: [] });
      return;
    }

    const { searchFn } = this.props;
    this.setState({ state: 'searching' });

    searchFn(value).then((list) => {
      this.setState({
        list,
        state: list.length ? 'found' : 'notFound',
      }, () => {
        this.list.current.scrollTop = 0;
      });
    });
  }

  scrollToFocusedItem() {
    const { focusedIndex } = this.state;
    if (focusedIndex === null) return;

    const listEl = this.list.current;
    const focusedItem = listEl.querySelector('.focused');

    const itemBottomPos = focusedItem.offsetTop + focusedItem.offsetHeight;
    const viewportBottomPos = listEl.scrollTop + listEl.offsetHeight;

    if (itemBottomPos < viewportBottomPos && focusedItem.offsetTop > listEl.scrollTop) {
      return;
    }

    listEl.scrollTop = focusedItem.offsetTop - 50;
  }

  render() {
    const { placeholder, label } = this.props;
    const {
      list, focused, selectedItem, query, focusedIndex, state,
    } = this.state;

    return (
      <label className="auto-complete">
        <p className="label-text">{label}</p>
        <div className={cn('input-container', { focused })}>
          {state === 'searching' && (<i className="spinner" />)}
          <input
            ref={this.input}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onQueryChange}
            onKeyDown={this.onKeyDown}
            value={query}
            type="text"
            placeholder={selectedItem ? '' : placeholder}
          />
          {selectedItem && (
            <div className={cn('selected-value', { typing: focused })}>
              {selectedItem.value}
            </div>
          )}
        </div>
        <div
          className={cn('list', { active: focused, 'not-found': state === 'notFound' })}
          ref={this.list}
        >
          <ul>
            <li className="message">Nothing found</li>
            {(list || []).map((item, index) => (
              <li key={item.id}>
                <button
                  className={cn('list-item', { focused: focusedIndex === index })}
                  type="button"
                  onMouseDown={this.onItemMouseDown}
                  onClick={() => this.setItem(item)}
                >
                  {item.value}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </label>
    );
  }
}

AutoComplete.propTypes = {
  /**
    * Message prop description goes here
  */
  placeholder: PropTypes.string,

  /**
    * Label prop description goes here
  */
  label: PropTypes.string,
  /**
    * Function which accepts search string argument and must return promise which
    * must resolves to array of objects with value and id props:
    * [{ id: 1, value: 'One' }, ...]
  */
  searchFn: PropTypes.func.isRequired,
  /**
    * Callback on selected value changed
  */
  onChange: PropTypes.func.isRequired,
};

AutoComplete.defaultProps = {
  placeholder: 'Start typing...',
  label: 'Select value',
};

export default AutoComplete;
