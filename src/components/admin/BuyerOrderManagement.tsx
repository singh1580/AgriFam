
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Truck, Calendar, MessageSquare, Phone, Search, Filter } from 'lucide-react';
import { useBuyerOrdersData } from '@/hooks/useBuyerOrdersData';
import { useBuyerOrderActions } from '@/hooks/useBuyerOrderActions';
import { useBulkActions } from '@/hooks/useBulkActions';
import BulkActionsToolbar from './BulkActionsToolbar';
import { format } from 'date-fns';
import OrderStatsCards from './OrderStatsCards';

const BuyerOrderManagement = () => {
  const { orders, stats, isLoading } = useBuyerOrdersData();
  const { updateOrderStatus, updateDeliveryDate, addSupportNote, processingId } = useBuyerOrderActions();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [supportNote, setSupportNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    selectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isItemSelected,
    getSelectedItems,
    selectionCount
  } = useBulkActions();

  const selectedOrders = getSelectedItems(orders);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUpdateDeliveryDate = async (orderId: string) => {
    if (deliveryDate) {
      await updateDeliveryDate(orderId, deliveryDate);
      setDeliveryDate('');
    }
  };

  const handleAddSupportNote = async (orderId: string) => {
    if (supportNote.trim()) {
      await addSupportNote(orderId, supportNote);
      setSupportNote('');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
            Buyer Order Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage and track all buyer orders across the platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStatsCards stats={stats} />

      {/* Search and Filters */}
      <Card className="bg-gradient-to-r from-white/80 to-white/90 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders by product, buyer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-white/30"
              />
            </div>
            <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm border-white/30">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Management */}
      <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span>Buyer Orders</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {stats.pendingOrders} pending
              </Badge>
            </CardTitle>
            
            {filteredOrders.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectionCount === filteredOrders.length}
                  onCheckedChange={() => toggleAll(filteredOrders)}
                />
                <span className="text-sm text-muted-foreground">Select all</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <BulkActionsToolbar 
            selectedCount={selectionCount} 
            onClearSelection={clearSelection}
          >
            <Select>
              <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-white/30">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
              Update Selected
            </Button>
          </BulkActionsToolbar>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm ? 'No orders found matching your search' : 'No buyer orders found'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="bg-gradient-to-br from-white/60 to-white/80 backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                      <div className="flex items-start space-x-4 flex-1">
                        <Checkbox
                          checked={isItemSelected(order.id)}
                          onCheckedChange={() => toggleItem(order.id)}
                          className="mt-1"
                        />
                        
                        <div className="space-y-4 flex-1">
                          {/* First Line - Product and Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <h4 className="font-semibold text-lg text-foreground">
                              {order.product?.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getStatusColor(order.status)} border shadow-sm`}>
                                {order.status?.replace('_', ' ')}
                              </Badge>
                              {order.tracking_id && (
                                <Badge variant="outline" className="bg-white/70 border-blue-200">
                                  #{order.tracking_id}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Second Line - Order Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/20">
                            <div className="space-y-1">
                              <span className="text-xs font-medium text-primary uppercase tracking-wide">Buyer</span>
                              <p className="font-medium text-foreground text-sm">{order.buyer?.full_name}</p>
                              <p className="text-xs text-muted-foreground truncate">{order.buyer?.email}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-medium text-primary uppercase tracking-wide">Quantity</span>
                              <p className="font-medium text-foreground">{order.quantity_ordered} {order.product?.quantity_unit}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-medium text-primary uppercase tracking-wide">Amount</span>
                              <p className="font-bold text-green-600 text-lg">₹{order.total_amount?.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-medium text-primary uppercase tracking-wide">Order Date</span>
                              <p className="font-medium text-foreground text-sm">{format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>

                          {/* Additional Details */}
                          {order.delivery_address && (
                            <div className="bg-gradient-to-r from-gray-50/80 to-gray-50/60 backdrop-blur-sm p-3 rounded-lg border border-gray-200/50">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Delivery Address</span>
                              <p className="text-sm text-foreground mt-1">{order.delivery_address}</p>
                            </div>
                          )}

                          {order.delivery_date && (
                            <div className="bg-gradient-to-r from-green-50/80 to-green-50/60 backdrop-blur-sm p-3 rounded-lg border border-green-200/50">
                              <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Expected Delivery</span>
                              <p className="text-sm text-green-900 mt-1 font-medium">
                                {format(new Date(order.delivery_date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="bg-white/70 backdrop-blur-sm border-white/40 hover:bg-white/90 transition-all duration-200"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Manage
                        </Button>

                        {order.status === 'pending' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            disabled={processingId === order.id}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md"
                            size="sm"
                          >
                            Confirm Order
                          </Button>
                        )}

                        {order.status === 'confirmed' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            disabled={processingId === order.id}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                            size="sm"
                          >
                            Start Processing
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  {/* Expanded Management Section */}
                  {selectedOrder === order.id && (
                    <div className="border-t border-white/20 bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Delivery Management */}
                          <div className="space-y-4">
                            <h5 className="font-medium text-foreground">Delivery Management</h5>
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="delivery-date">Expected Delivery Date</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id="delivery-date"
                                    type="date"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    className="bg-white/70 backdrop-blur-sm border-white/40"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateDeliveryDate(order.id)}
                                    disabled={!deliveryDate}
                                    className="bg-gradient-to-r from-primary to-primary/90"
                                  >
                                    Set Date
                                  </Button>
                                </div>
                              </div>
                              {order.tracking_id && (
                                <div>
                                  <Label>Tracking ID</Label>
                                  <div className="flex items-center space-x-2">
                                    <Input value={order.tracking_id} readOnly className="bg-white/50" />
                                    <Button size="sm" variant="outline" className="bg-white/70">
                                      <Phone className="h-4 w-4 mr-1" />
                                      Contact
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Customer Support */}
                          <div className="space-y-4">
                            <h5 className="font-medium text-foreground">Customer Support</h5>
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="support-note">Add Support Note</Label>
                                <div className="space-y-2">
                                  <Textarea
                                    id="support-note"
                                    placeholder="Add customer support note..."
                                    value={supportNote}
                                    onChange={(e) => setSupportNote(e.target.value)}
                                    className="bg-white/70 backdrop-blur-sm border-white/40"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddSupportNote(order.id)}
                                    disabled={!supportNote.trim()}
                                    className="bg-gradient-to-r from-primary to-primary/90"
                                  >
                                    Add Note
                                  </Button>
                                </div>
                              </div>
                              {order.notes && (
                                <div>
                                  <Label>Order Notes</Label>
                                  <div className="bg-white/50 backdrop-blur-sm p-3 rounded border border-white/30 text-sm">
                                    {order.notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerOrderManagement;
