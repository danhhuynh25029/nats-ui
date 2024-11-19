import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function LoginForm() {
    const actionLogin = () => {
        
    }
    return (
        <div className="flex h-screen w-ful items-center justify-center px-4">
        <Card className="mx-auto w-[350px]">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Username</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full" onClick={actionLogin}>
                        Login
                    </Button>
                </div>
            </CardContent>
        </Card>
        </div>
    )
}
