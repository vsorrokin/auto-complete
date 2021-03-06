/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AutoComplete from './index';
import mockData from './mock';

const ENDPOINT = 'https://api.com/countries';
const mock = new MockAdapter(axios, { delayResponse: 300 });
mock.onGet(ENDPOINT).reply(({ query }) => [
  200,
  mockData
    .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    .map(({ name, code }) => ({ id: code, value: name })),
]);

export default {
  title: 'Example/Auto-complete',
  component: AutoComplete,
  // parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {
    placeholder: { control: 'text' },
    label: { control: 'text' },
  },
};

const Template = (args) => <AutoComplete {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Select country',
  placeholder: 'Start typing country name...',
  searchFn: (query) => axios
    .get(ENDPOINT, { query })
    .then(({ data }) => data),
  onChange: (value) => {
    console.log('Item selected:', value);
  },
};
