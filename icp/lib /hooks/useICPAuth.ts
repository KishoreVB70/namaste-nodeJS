import { useState, useCallback, useEffect } from "react";
import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { useAuth } from "@/lib/context/AuthContext";
import { popupCenter } from "@/lib/utils/utils";
import { ICPAuthReturn } from "@/lib/types";
import { ii_url, nft_canister_id, nft_canister_id_local } from "@/lib/constants";

function useICPAuth(): ICPAuthReturn {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const { setPrincipal, setIsAuthenticated, setUserActor, setIsAuthLoading } = useAuth();

  const createUserActor = useCallback(async (identity: Identity) => {
    try {
      const isLocal = process.env.NODE_ENV === 'development'

      const host = isLocal ? 'http://127.0.0.1:4943':'https://ic0.app';
  
      const agent = await HttpAgent.create({ host: host, identity })
      const canisterId = isLocal ? nft_canister_id_local : nft_canister_id
  
      if (isLocal && process.env.NEXT_PUBLIC_DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check to ensure that your local replica is running"
          );
          console.error(err);
        });
      }
  
      const nftActor: ActorSubclass<_SERVICE> = Actor.createActor(nftIDL, {
        agent,
        canisterId: canisterId,
      });
      setUserActor(nftActor);
    }
    catch (error) {
      console.log("Error creating user actor", error);
    }
  }, [setUserActor]);
  
  const loginWithInternetIdentity = useCallback(async () => {
    if (!authClient) {
      console.warn("AuthClient is not initialized.");
      return;
    }
    const isLocal = process.env.NODE_ENV === "development";
    // const identityProvider = isLocal ? ii_url_local : ii_url;
    const identityProvider = ii_url;

    try {
      await authClient.login({
        identityProvider,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          setIsAuthenticated(true);
          setPrincipal(identity.getPrincipal());
          await createUserActor(identity);
        },
        windowOpenerFeatures: popupCenter(),
      });
    } catch (error) {
      console.error("Login with Internet Identity failed:", error);
    }
  }, [authClient, setPrincipal, setIsAuthenticated, createUserActor]);

  const logout = useCallback(async () => {
    if (!authClient) {
      console.warn("AuthClient is not initialized.");
      return;
    }

    try {
      await authClient.logout();
      setPrincipal(null);
      setIsAuthenticated(false);
      setUserActor(null);
      await cleanup()
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [authClient, setIsAuthenticated, setPrincipal, setUserActor]);

  // Remove user residue after logout
  // Warn: removing cleanup will lead to Certification errors when user switches identity
  const cleanup = async() => {
    try {
      const databases: IDBDatabaseInfo[] = await window.indexedDB.databases();
      databases.forEach(db => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.log("Error during logout cleanup", error);
    }
  }
  
  // Initialize the AuthClient and check if the user is authenticated
  const initializeAuthClient = useCallback(async() => {
    try {
      setIsAuthLoading(true);
      const client: AuthClient = await AuthClient.create();
      setAuthClient(client);
  
      const authStatus = await client.isAuthenticated();
      if (authStatus) {
        const identity = client.getIdentity();
        setIsAuthenticated(true);
        setPrincipal(identity.getPrincipal());
        await createUserActor(identity);
      }
    } catch (error) {
      console.log("Error while intializing auth client: ", error);
    } finally {
      setIsAuthLoading(false);
    }
  },[setIsAuthenticated, setPrincipal, setIsAuthLoading, createUserActor])

  useEffect(() => {
    initializeAuthClient();
  }, [initializeAuthClient]);

  return { loginWithInternetIdentity, logout };
}

export default useICPAuth;