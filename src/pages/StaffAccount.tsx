import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationHeader } from '@/components/NavigationHeader';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Shield, MapPin, Edit } from 'lucide-react';

const StaffAccount = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    full_name: currentUser?.full_name || '',
    department: currentUser?.department || ''
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('staff_accounts')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          department: formData.department
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account updated successfully"
      });

      setIsEditing(false);
      
      // Update localStorage with new data
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem('pixoul_staff_account', JSON.stringify(updatedUser));
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Not logged in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="cyber-border bg-card rounded-xl p-8">
            <BackButton className="mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-bold text-3xl flex items-center gap-3">
                <User className="w-8 h-8" />
                My Staff Account
              </h1>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your staff account details and credentials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleUpdateAccount} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                        <p className="text-lg">@{currentUser.username}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                        <p className="text-lg">{currentUser.full_name}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline">{currentUser.department}</Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Account ID</Label>
                        <p className="text-sm font-mono text-muted-foreground">{currentUser.id}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common staff activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/scheduling">
                      📅 Manage Schedule
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/private-chat">
                      💬 Open Chat
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/announcements">
                      📢 View Announcements
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/maintenance-reports">
                      🔧 Report Issues
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Activity Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>
                  Your recent staff activities and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">Active</p>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">{currentUser.department}</p>
                    <p className="text-sm text-muted-foreground">Department</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">Staff</p>
                    <p className="text-sm text-muted-foreground">Role</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">Online</p>
                    <p className="text-sm text-muted-foreground">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAccount;