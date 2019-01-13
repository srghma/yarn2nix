{ yarn2nix }:

let
  inherit (yarn2nix.pkgs) stdenv;

  modules = yarn2nix.mkYarnModules {
    name = "foo";
    pname = "bar";
    version = "1";
    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;
  };
in
stdenv.mkDerivation {
  name = "test";

  phases = ["buildPhase"];

  buildPhase = ''
    source ${../../nix/expectShFunctions.sh}

    expectFilePresent ${modules}/node_modules/.yarn-integrity

    # dependencies
    expectFilePresent ${modules}/node_modules/express/package.json

    # devDependencies
    expectFilePresent ${modules}/node_modules/load-grunt-tasks/package.json

    mkdir -p $out
    echo "passed" > $out/test-passed
  '';
}
