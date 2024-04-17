#! /bin/bash

# 指定分支，默认为 develop 分支(yarn release develop)
branch=$1
if [ -z $branch ]
then
  branch=develop
fi

read -p "确定将 $branch 分支合并到 master 分支并发布? (y/n)" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
  # 合并代码到 master 分支
  git checkout master
  git merge $branch

  # 指定上线版本，如 1.0.0，最后会生成 tag v1.0.0
  echo "输入当前上线的版本号: "
  read VERSION

  read -p "当前版本 $VERSION - are you sure? (y/n)" -n 1 -r
  echo    

  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    # 修改版本号
    yarn version --new-version $VERSION --no-git-tag-version --allow-same-version

    # 生成变更日志, 打 tag 
    yarn changelog
    git add .
    git commit -m "release: $VERSION" --no-verify
    git tag v$VERSION

    # 提交代码
    git push origin master
    git push origin refs/tags/v$VERSION

    # 合并代码到 develop 分支
    git checkout develop
    git rebase master
    git push origin develop
  else
    echo '取消发布'
  fi

else
  echo '取消发布'
fi

