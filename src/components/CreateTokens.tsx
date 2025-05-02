import { useMintAdminAndRewardTokens } from "~/hooks/useMintAdminAndRewardTokens";

export default function CreateTokens() {
  const {
    tokenName, setTokenName,
    quantity, setQuantity,
    policyId, setPolicyId,
    dummyKey, setDummyKey,
    handleSubmit,
  } = useMintAdminAndRewardTokens();

  return (
    <div>
      <form onSubmit={handleSubmit} 
      className="
            form
            mx-auto
            space-y-4
            [&_input]:rounded-lg
            [&_input]:border
            [&_input]:border-gray-300
            [&_input]:px-4
            [&_input]:py-2
            [&_input]:focus:outline-none
            [&_input]:focus:ring-2
            [&_input]:focus:ring-blue-500
          ">
        <div className="text-2xl font-bold text-galaxy2-info text-center">Mint Your Admin & Reward Tokens</div>
        <input
          type="text"
          placeholder="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
       <div className="text-sm text-gray-500">
          <p className="mb-2 font-medium">
            Things to keep in mind before minting with a Policy ID:
          </p>

          {/* numbered list */}
          <ol className="list-decimal pl-6 space-y-1">
            <li>You should have minted the token on this page.</li>
            <li>You should have minted with the same wallet.</li>
            <li>You can find the dummy key hash in the metadata of the previous token.</li>
          </ol>
        </div>

        <input
          type="text"
          placeholder="PolicyId(optional)"
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dummy Key Hash (mandatory if using Policy ID)"
          value={dummyKey}
          onChange={(e) => setDummyKey(e.target.value)}
        />
        <button
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          type="submit"
        >
          Mint Tokens
        </button>
      </form>  
    </div>
  );
}
