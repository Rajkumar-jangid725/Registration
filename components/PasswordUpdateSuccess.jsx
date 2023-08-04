import Link from 'next/link'

const PasswordUpdateSuccess = () => {
    return (
        <>
            <div className="card-body p-5">
                <h1 className="text-4xl text-uppercase text-center mb-4">
                    Password Updated
                </h1>
                <p className="text-center text-black-10 mt-5 mb-0">
                    Password Successfully updated.{"  "}
                    <Link href={"/login"} className="font-bold text-black">
                        login here
                    </Link>
                </p>
            </div>
        </>
    );
};

export default PasswordUpdateSuccess;