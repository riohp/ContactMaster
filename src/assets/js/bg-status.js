export const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'agendado':
        return 'bg-info';
      case 'exitoso':
        return 'bg-success';
      case 'en proceso':
        return 'bg-warning';
      default:
        return 'bg-danger';
    }
};