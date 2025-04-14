import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CONSTANTS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

export default function Settings() {
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [exportFormat, setExportFormat] = useState('json');
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const handleExport = () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        data: {
          finances: [],
          workLogs: [],
          debts: []
        }
      };
      
      // Create a blob from the data
      let blob: Blob;
      if (exportFormat === 'json') {
        blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      } else {
        // Simple CSV format for demo
        const csvContent = 'timestamp,type,data\n' + new Date().toISOString() + ',export,"See JSON for full data"';
        blob = new Blob([csvContent], { type: 'text/csv' });
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pichacka-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast({
        title: "Export úspěšný",
        description: `Data byla exportována ve formátu ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export selhal",
        description: "Nepodařilo se exportovat data.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    setIsConfirmLogoutOpen(false);
  };
  
  return (
    <div className="pb-20 md:pb-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Obecné</TabsTrigger>
          <TabsTrigger value="rates">Sazby a procenta</TabsTrigger>
          <TabsTrigger value="activities">Aktivity</TabsTrigger>
          <TabsTrigger value="account">Účet</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Obecná nastavení</CardTitle>
                <CardDescription>Změňte základní nastavení aplikace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rent-amount">Výše nájmu (Kč)</Label>
                  <Input
                    id="rent-amount"
                    type="number"
                    defaultValue={CONSTANTS.RENT_AMOUNT}
                    min={0}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatická platba nájmu</Label>
                    <p className="text-sm text-muted-foreground">Automaticky odečíst nájem první den v měsíci</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tmavý režim</Label>
                    <p className="text-sm text-muted-foreground">Přepnout na tmavý režim</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Zaokrouhlování</Label>
                    <p className="text-sm text-muted-foreground">Zaokrouhlovat částky na celé koruny</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Uložit změny</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="rates">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sazby a procenta</CardTitle>
                <CardDescription>Upravte hodinové sazby a procenta srážek</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Maru</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maru-rate">Hodinová sazba (Kč/h)</Label>
                      <Input
                        id="maru-rate"
                        type="number"
                        defaultValue={275}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maru-deduction">Srážka (%)</Label>
                      <Input
                        id="maru-deduction"
                        type="number"
                        defaultValue={33}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Marty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marty-rate">Hodinová sazba (Kč/h)</Label>
                      <Input
                        id="marty-rate"
                        type="number"
                        defaultValue={400}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marty-deduction">Srážka (%)</Label>
                      <Input
                        id="marty-deduction"
                        type="number"
                        defaultValue={50}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Uložit změny</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="activities">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Aktivity</CardTitle>
                <CardDescription>Spravujte kategorie aktivit pro sledování času</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CONSTANTS.ACTIVITIES.map((activity, index) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <span 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: activity.color }}
                        ></span>
                        <span>{activity.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <i className='bx bx-edit-alt mr-1'></i> Upravit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          <i className='bx bx-trash mr-1'></i> Smazat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button>
                    <i className='bx bx-plus mr-2'></i> Přidat novou aktivitu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="account">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Nastavení účtu</CardTitle>
                <CardDescription>Spravujte nastavení vašeho účtu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Zobrazované jméno</Label>
                  <Input
                    id="display-name"
                    defaultValue={user?.displayName || ""}
                    placeholder="Vaše jméno"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="initials">Iniciály</Label>
                  <Input
                    id="initials"
                    defaultValue={user?.avatarInitials || ""}
                    placeholder="MN"
                    maxLength={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.username || ""}
                    placeholder="vas@email.cz"
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-3">Změna hesla</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Současné heslo</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nové heslo</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Potvrzení hesla</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog open={isConfirmLogoutOpen} onOpenChange={setIsConfirmLogoutOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-red-500 hover:text-red-700">
                      <i className='bx bx-log-out mr-2'></i> Odhlásit se
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Opravdu se chcete odhlásit?</DialogTitle>
                      <DialogDescription>
                        Po odhlášení se budete muset znovu přihlásit pro pokračování práce.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsConfirmLogoutOpen(false)}>Zrušit</Button>
                      <Button variant="destructive" onClick={handleLogout}>Odhlásit se</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button>Uložit změny</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="data">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Data a zálohování</CardTitle>
                <CardDescription>Exportujte nebo importujte data aplikace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Export dat</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="export-format">Formát exportu</Label>
                      <Select
                        value={exportFormat}
                        onValueChange={setExportFormat}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte formát" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button onClick={handleExport}>
                        <i className='bx bx-download mr-2'></i> Exportovat data
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Import dat</h3>
                  <div className="space-y-4">
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".json,.csv"
                    />
                    <div className="flex items-center space-x-4">
                      <Button variant="outline">
                        <i className='bx bx-upload mr-2'></i> Importovat data
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upozornění: Import přepíše existující data. Před importem doporučujeme provést zálohu.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-red-500">Nebezpečná zóna</h3>
                  <div className="space-y-4">
                    <Button variant="destructive">
                      <i className='bx bx-trash mr-2'></i> Smazat všechna data
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Varování: Tato akce je nevratná a odstraní všechna vaše data z aplikace.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
