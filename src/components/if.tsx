interface IFProps {
    condition: boolean;
    children: React.ReactNode;
}

export default function IF({ children, condition }: IFProps) {
    return (
        <>
         {condition && children}
        </>
    );
}