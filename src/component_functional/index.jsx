import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from '../libs/debounce';
import '../component/style.scoped.styl';

function AutoComplete({
  onChange, searchFn, placeholder, label,
}) {
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [list, setList] = useState([]);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  // idle/typing/searching/found/notFound/selected
  const [state, setState] = useState('idle');

  const search = (value) => {
    if (!value) {
      setList([]);
      return;
    }

    setState('searching');

    searchFn(value).then((newList) => {
      setList(newList);
      setState(newList.length ? 'found' : 'notFound');
      setTimeout(() => {
        listRef.current.scrollTop = 0;
      });
    });
  };

  const debouncedSearch = debounce(search, 300);

  const onQueryChange = ({ target: { value } }) => {
    setSelectedItem(null);
    setQuery(value);
    setFocusedIndex(null);
    setState(value ? 'typing' : 'idle');
    debouncedSearch(value);
  };

  const onItemMouseDown = () => {
    // Items list is visible when input is in focus.
    // Items list is out of input range so when users clicks on
    // the item there is a problem: input blur fires before
    // item click event so setItem is never called.
    // That's why we need manually to set focus before blur fires.
    setTimeout(() => inputRef.current.focus());
  };

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  const scrollToFocusedItem = () => {
    if (focusedIndex === null) return;

    const listEl = listRef.current;
    const focusedItem = listEl.querySelector('.focused');

    const itemBottomPos = focusedItem.offsetTop + focusedItem.offsetHeight;
    const viewportBottomPos = listEl.scrollTop + listEl.offsetHeight;

    if (itemBottomPos < viewportBottomPos && focusedItem.offsetTop > listEl.scrollTop) {
      return;
    }

    listEl.scrollTop = focusedItem.offsetTop - 50;
  };

  const setItem = (item) => {
    // We need to blur input after item selected because
    // it is in focus still: See "onItemMouseDown" method comment.
    setTimeout(() => inputRef.current.blur());

    setSelectedItem(item);
    setQuery('');
    setList([]);
    setFocusedIndex(null);
    setState('selected');

    onChange(item);
  };

  const onKeyDown = (e) => {
    const mapping = {
      40: 'down',
      38: 'up',
      13: 'enter',
    };
    const key = mapping[e.which];

    if (!key || !list.length) return;

    e.preventDefault();

    if (key === 'enter') {
      if (focusedIndex !== null) {
        setItem(list[focusedIndex]);
      }
      return;
    }

    if (focusedIndex !== null) {
      const maxIndex = list.length - 1;
      const currentIndex = focusedIndex;
      let newIndex = currentIndex + (key === 'down' ? 1 : -1);
      if (newIndex < 0) newIndex = 0;
      if (newIndex > maxIndex) newIndex = maxIndex;
      setFocusedIndex(newIndex);
      setTimeout(scrollToFocusedItem);
      return;
    }

    setFocusedIndex(0);
    setTimeout(scrollToFocusedItem);
  };

  const highlightQuery = (value) => {
    // Escape html tags
    const safeValue = new XMLSerializer().serializeToString(document.createTextNode(value));
    return {
      __html: safeValue.replace(new RegExp(query, 'gi'), (match) => `<b>${match}</b>`),
    };
  };

  return (
    <label className="auto-complete">
      {label && (<p className="label-text">{label}</p>)}
      <div className={cn('input-container', { focused })}>
        {state === 'searching' && (<i className="spinner" />)}
        <input
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onQueryChange}
          onKeyDown={onKeyDown}
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
        ref={listRef}
      >
        <ul>
          <li className="message">Nothing found</li>
          {(list || []).map((item, index) => (
            <li key={item.id}>
              <button
                className={cn('list-item', { focused: focusedIndex === index })}
                type="button"
                onMouseDown={onItemMouseDown}
                onClick={() => setItem(item)}
              >
                <span dangerouslySetInnerHTML={highlightQuery(item.value)} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
}

AutoComplete.propTypes = {
  /**
    * Placeholder text
  */
  placeholder: PropTypes.string,

  /**
    * Label text
  */
  label: PropTypes.string,
  /**
    * Function which accepts search string argument and must return
    * promise which resolves to array of objects with value and id props:
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
