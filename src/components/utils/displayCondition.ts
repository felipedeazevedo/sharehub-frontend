export const displayCondition = (condition: string) => {
    const conditionMap: { [key: string]: string } = {
      'NEW': 'Equipamento novo',
      'USED': 'Equipamento usado',
      'PARTIALLY_FUNCTIONAL': 'Equipamento parcialmente funcional'
    };
  
    return conditionMap[condition] || condition;
};