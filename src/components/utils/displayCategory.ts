export const displayCategory = (category: string) => {
  const categoryMap: { [key in string]: string } = {
    'ESTETOSCOPIO': 'Estetoscópio',
    'MONITOR_PRESSAO': 'Monitor de pressão arterial',
    'OXIMETRO_PULSO': 'Oxímetro de pulso',
    'MICROSCOPIO': 'Microscópio',
    'MANEQUINS_SIMULACAO': 'Manequim de simulação',
    'INSTRUMENTOS_CIRURGICOS': 'Instrumentos cirúrgicos',
    'DESFIBRILADOR': 'Desfibrilador',
    'BOMBA_INFUSAO': 'Bomba de infusão',
    'RESPIRADOR': 'Respirador',
  };

  return categoryMap[category] || category;
};