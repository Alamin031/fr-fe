import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const TextInputDashboard = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // GET - Fetch all items
  const fetchItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/text/textget`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // POST - Create new item
  const handlePost = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/text/textpostapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue }),
      });

      if (!response.ok) throw new Error('Failed to post data');
      setInputValue('');
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE - Edit item
  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/text/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editValue }),
      });

      setEditingId(null);
      setEditValue('');
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE - Remove item
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URI}/text/textdeleteapi`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });

      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing
  const startEditing = (item: any) => {
    setEditingId(item._id || item.id);
    setEditValue(item.text);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePost();
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-4">
      {/* Input Section */}
     

      {/* Items List */}
      <div className="space-y-3">
        {
            items.length === 0 && (
                 <div className="flex gap-2 mb-6">
        <Input 
          placeholder="Type something..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button 
          onClick={handlePost}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </Button>
      </div>
            )
        }
        {items.map((item) => (
          <div key={item._id || item.id} className="flex items-center justify-between p-3 border rounded-lg">
            {editingId === (item._id || item.id) ? (
              // Edit Mode
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleUpdate(item._id || item.id)}
                  disabled={isLoading}
                  size="sm"
                >
                  Save
                </Button>
                <Button 
                  onClick={cancelEditing}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              // View Mode
              <>
                <span className="flex-1">{item.text}</span>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => startEditing(item)}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDelete(item._id || item.id)}
                    disabled={isLoading}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextInputDashboard;