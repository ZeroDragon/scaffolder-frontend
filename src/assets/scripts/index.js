import _ from 'lodash';
import $ from 'jquery';

const component = () => {
  const element = $('<div/>');
  element.append(_.join(['hello', 'webpack'], ' '));
  return element;
};
$(document).ready(() => {
  $('body').append(component());
});
