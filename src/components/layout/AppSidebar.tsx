import { useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { usePrivateMessageNotifications } from '@/hooks/usePrivateMessageNotifications';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Megaphone,
  Wrench,
  Search,
  Settings,
  User,
  LogOut
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Staff Scheduling',
    url: '/scheduling',
    icon: Calendar,
    badge: null,
  },
  {
    title: 'Private Chat',
    url: '/private-chat',
    icon: MessageSquare,
    badge: 'unread',
  },
  {
    title: 'Announcements',
    url: '/announcements',
    icon: Megaphone,
    badge: null,
  },
  {
    title: 'Maintenance',
    url: '/maintenance',
    icon: Wrench,
    badge: null,
  },
  {
    title: 'Lost & Found',
    url: '/lost-found',
    icon: Search,
    badge: null,
  },
];

const bottomItems = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user, signOut } = useAuth();
  const { unreadCount } = usePrivateMessageNotifications();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) ? 'pixoul-nav-active' : 'pixoul-nav-hover';
  };

  return (
    <Sidebar className={`pixoul-sidebar ${collapsed ? 'w-14' : 'w-64'}`}>
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm">Pixoul Staff Hub</h2>
              <p className="text-xs text-muted-foreground">Gaming Operations</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="pixoul-subtitle mb-4">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClassName(item.url)} flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge === 'unread' && unreadCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="h-5 w-5 rounded-full p-0 text-xs"
                            >
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClassName(item.url)} flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span className="flex-1">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t border-border/50">
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.full_name}</p>
                <p className="text-xs text-muted-foreground">Staff Member</p>
              </div>
            )}
            <button
              onClick={signOut}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <SidebarTrigger className="absolute -right-4 top-6 bg-card border border-border rounded-full p-2 shadow-md" />
    </Sidebar>
  );
};