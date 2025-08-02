import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationHeader } from '@/components/NavigationHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const lostItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  location_found: z.string().min(1, "Location is required"),
  image_url: z.string().optional()
});

type LostItemForm = z.infer<typeof lostItemSchema>;

interface LostItem {
  id: string;
  item_name: string;
  description: string;
  location_found: string;
  image_url?: string;
  status: 'lost' | 'claimed';
  created_at: string;
  reported_by: string;
}

const LostFound = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LostItemForm>({
    resolver: zodResolver(lostItemSchema),
    defaultValues: {
      item_name: '',
      description: '',
      location_found: '',
      image_url: ''
    }
  });

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error",
        description: "Failed to load lost items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LostItemForm) => {
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('lost_items')
        .insert({
          ...data,
          reported_by: user.id,
          status: 'lost'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lost item reported successfully"
      });

      form.reset();
      fetchItems();
    } catch (error) {
      console.error('Error submitting item:', error);
      toast({
        title: "Error",
        description: "Failed to report lost item",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItemStatus = async (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'lost' ? 'claimed' : 'lost';
    
    try {
      const { error } = await supabase
        .from('lost_items')
        .update({ status: newStatus })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Item marked as ${newStatus}`
      });

      fetchItems();
    } catch (error) {
      console.error('Error updating item status:', error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-orbitron font-bold text-3xl neon-text mb-2">
              Lost & Found System
            </h1>
            <p className="text-muted-foreground font-exo text-lg">
              Manage lost and found items from the VR arcade. Track, log, and reunite items with their owners.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Report Form */}
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle className="font-orbitron">Report Lost Item</CardTitle>
                <CardDescription>
                  Submit details about a lost item found on the premises
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="item_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. iPhone, Keys, Wallet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location_found"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Found</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. VR Room 3, Front Desk, Lounge" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed description of the item, including color, brand, any distinctive features..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Report Lost Item'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Items List */}
            <div className="space-y-4">
              <h2 className="font-orbitron font-semibold text-xl text-primary">
                Recent Lost Items ({items.length})
              </h2>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {items.map((item) => (
                  <Card key={item.id} className="cyber-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-orbitron font-semibold text-lg">
                            {item.item_name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-exo">
                            Found at: {item.location_found}
                          </p>
                          <p className="text-xs text-muted-foreground font-exo">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={item.status === 'lost' ? 'destructive' : 'default'}
                          >
                            {item.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleItemStatus(item.id, item.status)}
                          >
                            Mark as {item.status === 'lost' ? 'Claimed' : 'Lost'}
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm font-exo mb-3">
                        {item.description}
                      </p>
                      
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.item_name}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFound;