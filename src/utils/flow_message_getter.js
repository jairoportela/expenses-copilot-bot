import {
  CreateExpenseCommandText,
  CreateIncomeCommandText,
} from '../constants/constants.js';

const flowMessageGetter = (currentFlow) => {
  if (currentFlow == CreateExpenseCommandText) {
    return 'gasto';
  } else if (currentFlow == CreateIncomeCommandText) {
    return 'ingreso';
  }
  return '';
};

export default flowMessageGetter;
