{ yarn2nix }:

yarn2nix.mkYarnWorkspace {
  src = ./.;

  packageOverrides = {
    package-one = {
      publishBinsFor = [ "package-one" "gulp" ];

      doInstallCheck = true;
      installCheckPhase = ''
        ${import ../../nix/expectShFunctions.nix}

        output=$($out/bin/package-one)
        expected_output="HELLO FROM PACKAGE-TWO!"
        expectEqual "$output" "$expected_output"

        $out/bin/gulp --help
      '';
    };
  };
}
