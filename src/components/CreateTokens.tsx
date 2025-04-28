import { useMintAdminAndRewardTokens } from "~/hooks/useMintAdminAndRewardTokens";

export default function CreateTokens() {
  const {
    tokenName, setTokenName,
    quantity, setQuantity,
    policyId, setPolicyId,
    handleSubmit,
  } = useMintAdminAndRewardTokens();

  return (
    <div>
      <form onSubmit={handleSubmit} className="form text-black">
        <div className="text-2xl font-bold text-galaxy2-info">Mint Your Admin & Reward Tokens</div>
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
        <input
          type="text"
          placeholder="PolicyId(optional)"
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
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
