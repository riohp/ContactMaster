import { Popover } from 'bootstrap';

export function usePopover() {

  const initializePopover = (event) => {
    const popoverTrigger = event.currentTarget;
    const popover = new Popover(popoverTrigger, {
      trigger: 'hover',
      placement: 'left'
    });
    popover.show();
  };

  return {
    initializePopover
  };
}