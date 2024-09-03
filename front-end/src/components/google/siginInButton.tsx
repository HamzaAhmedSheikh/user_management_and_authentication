import { Button } from "@/src/components/ui/button";

import { auth, signIn, signOut } from "@/src/auth";

export default async function SignInButton() {
    const session = await auth();
    console.log(session);   

    const user = session?.user;

    if (session?.user) {
        return (
            <form action={async () => {
                "use server"
                await signOut()
            }}>
                <Button className="w-full bg-gray-900 text-white" size="sm">
                    Sign Out
                </Button>
            </form>
        )
    }
    return user ? (
        <>
         <h1> Welcome {user.name} </h1>
         <form action={async () => {
            "use server"
            await signOut()
        }}>
            <Button className="w-full bg-gray-900 text-white" size="sm">
                Sign Out
            </Button>
        </form>
        </>
    ) : 
    (
        <> 
        <h1> Please Sign In </h1>
        <form action={async () => {
                "use server"
                await signIn("google")
        }}>
            <Button className="w-full bg-gray-900 text-white" size="sm">
               Sign In
            </Button>
        </form>
        </>
 
    )
}
