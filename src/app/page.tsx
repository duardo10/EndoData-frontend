import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Bem-vindo ao MyApp
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um projeto moderno com Next.js 14, TypeScript, Tailwind CSS e shadcn/ui.
            Pronto para desenvolvimento e totalmente configurado.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Principais</CardTitle>
              <CardDescription>Tudo que você precisa para começar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Next.js 14 com App Router</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">TypeScript configurado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Tailwind CSS + shadcn/ui</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Dark Mode integrado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Axios + API configurada</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exemplo de Formulário</CardTitle>
              <CardDescription>Componentes prontos para uso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Digite seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Enviar</Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>Como continuar o desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-semibold">1. Adicionar Rotas</h3>
                <p className="text-sm text-muted-foreground">
                  Crie novas páginas em <code className="bg-muted px-1 rounded">src/app</code>
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">2. Implementar API</h3>
                <p className="text-sm text-muted-foreground">
                  Use o serviço em <code className="bg-muted px-1 rounded">src/lib/api.ts</code>
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">3. Componentes</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione mais componentes shadcn/ui conforme necessário
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
