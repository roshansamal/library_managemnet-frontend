import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import type { MenuItem } from '../types/Menu';

type Props = {
  isCollapsed: boolean;
  items: MenuItem[];
};

export function SidebarDBMenu({ isCollapsed, items }: Props) {
  return (
    <div>
      {items.map((item) => (
        <MenuNode key={item.id} item={item} isCollapsed={isCollapsed} />
      ))}
    </div>
  );
}

function MenuNode({ item, isCollapsed }: { item: MenuItem; isCollapsed: boolean }) {
  const hasChildren = !!item.children && item.children.length > 0;
  const [open, setOpen] = useState(false);

  if (hasChildren) {
    // parent dropdown
    return (
      <div>
        <button onClick={() => setOpen((o) => !o)}>
          {!isCollapsed && item.label}
        </button>
        {open && (
          <div style={{ paddingLeft: 16 }}>
            {item.children!.map((child) => (
              <MenuNode key={child.id} item={child} isCollapsed={isCollapsed} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // leaf menu item
  return (
    <NavLink to={item.path || '#'}>
      {!isCollapsed && item.label}
    </NavLink>
  );
}
